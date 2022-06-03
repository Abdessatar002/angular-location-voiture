import { Cin } from "./cin";
import { Client } from "./client";
import { Permis } from "./Permis";

export class ClientDto {
    public client: Client;
    public cin: Cin;
    public permis: Permis;
}