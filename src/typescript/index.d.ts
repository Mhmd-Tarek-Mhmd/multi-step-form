// Types
export type eve = Event;
export type str = string;
export type num = number;
export type bool = boolean;
export type func = Function;
export type ele = HTMLElement;
export type form = HTMLFormElement;
export type btn = HTMLButtonElement;
export type input = HTMLInputElement;
export type label = HTMLLabelElement;

// Interfaces
export interface ModalInterface {
  step: num;
  plan: str;
  isMonthlyPlan: bool;
}
export interface ControllerInterface {
  getStep: func;
  setStep: func;
  getPlan: func;
  setPlan: func;
  getIsMonthlyPlan: func;
  toggleIsMonthlyPlan: func;
  init: func;
}
export interface Views {
  init: func;
  render: EventListener;
}
export interface HelpersInterface {
  stepsViews: Views[];
  changeStepViews: func;
  handleStepEvents: func;
  increaseStep: func;
  decreaseStep: EventListener;
  thanksStep: EventListener;
  togglePlan: EventListener;
  showSummary: func;
}
export interface Form extends form {
  elements: { name: input; email: input; phone: input; plan: input };
}
