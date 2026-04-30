import { HhAdapter } from "./adapters/HhAdapter";

const hhAdapter = new HhAdapter();

const jobs = await hhAdapter.fetchJobs();
