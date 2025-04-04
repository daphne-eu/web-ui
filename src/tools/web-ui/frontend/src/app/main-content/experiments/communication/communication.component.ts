import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Algorithm } from 'src/app/core/models/algorithm';
import { Cluster } from '../hetero-hardware/hetero-hardware.component';
import { DistributedBackend } from 'src/app/core/models/distributed-backend';
import { ExecutionMode } from '../hetero-hardware/hetero-hardware.component';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent {
  apiUrl: string;
  Cluster = Cluster;
  Algorithm = Algorithm;
  DistributedBackend = DistributedBackend;

  // Var for selected output
  selected_output_panel = "output-panel";

  cluster: Cluster = Cluster.local_machine;
  numberOfNodes = 4;
  selectedAlgorithm = Algorithm.connected_components;
  distributed_backend = DistributedBackend.sync_grpc;
  inputSize: string = "small";
  vega_token = "";

  result_output : string = "";
  agg_statistics = "";

  running_daphne = false;

  // Alerts
  show_success_alert = false;
  show_canceled_alert = false;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.apiUrl;
    this.killDaphne();
  }
  onSubmit() {
    // Create a payload object with the form data
    const payload : {
      cluster: Cluster,
      execution_mode: ExecutionMode,
      number_of_distributed_nodes: number,
      daphne_params: string[],
      daphne_args: string,
      vega_token: number
    }
    = {
      cluster: this.cluster,
      execution_mode: ExecutionMode.distributed,
      number_of_distributed_nodes: this.numberOfNodes,
      daphne_params: [],
      daphne_args: "",
      vega_token: parseInt(this.vega_token)
    };
    payload.daphne_params.push("--select-matrix-repr")
    payload.daphne_params.push("--distributed")
    payload.daphne_params.push("--dist_backend=" + this.distributed_backend)

    // Input
    payload.daphne_args = "scripts/algorithms/" + this.selectedAlgorithm + ".daph G=\"datasets/components/amazon.mtx\""
    // Clear output
    this.result_output = "";
    // Set flag
    this.running_daphne = true
    // Make a POST request to the API with the payload
    this.http.post(`${this.apiUrl}/api/run_daphne`, payload)
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.killDaphne();
            this.running_daphne = false;
            throw new Error(JSON.stringify(res));
          }

          this.getResults();
        },
        error: () => console.log(this)
      });
  }

  getResults() {
    var resultInterval = setInterval(() => {
    this.http.get(`${this.apiUrl}/api/get_output`).subscribe({
      next: (res: any) => {
        if (!this.running_daphne){
          clearInterval(resultInterval);
          return;
        }

        if(!res.running) {
          this.running_daphne = false;
          clearInterval(resultInterval);
          this.show_success_alert = true;
          setTimeout(() => {
            this.show_success_alert = false;
          }, 3000);
        }
        this.result_output = res.output.output
        this.agg_statistics = res.output.aggregate_statistics;
      }
    })
    }, 500);
  }

  killDaphne(){
    this.http.post(`${this.apiUrl}/api/kill_daphne`, null).subscribe({
      next: (res: any) => {
        console.log(res)
        this.running_daphne = false;
        if (res.success) {
          if (res.message === "Deployment killed."){
            this.show_canceled_alert = true;
            setTimeout(() => {
              this.show_canceled_alert = false;
            }, 3000);
          }
        }
      }
    })
  }
}
