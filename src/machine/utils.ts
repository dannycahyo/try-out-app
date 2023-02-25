import { Sender } from "xstate";
import { Context, MachineEvents } from "./type";

const setTimer = (ctx: Context) => (send: Sender<MachineEvents>) => {
  const interval = setInterval(() => {
    send("TICK");
  }, ctx.interval * 1000);

  return () => clearInterval(interval);
};

export { setTimer };
