import {
  str,
  num,
  bool,
  eve,
  input,
  ele,
  btn,
  label,
  Form,
  Views,
  ModalInterface,
  HelpersInterface,
  ControllerInterface,
} from "./index.d";

(function () {
  // Selectors
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  // Modal
  const Modal: ModalInterface = {
    step: 0,
    plan: "monthly",
    isMonthlyPlan: false,
  };

  // Controller
  const Controller: ControllerInterface = {
    getStep: (): num => Modal.step,
    setStep: (step: num): void => void (Modal.step = step),

    getPlan: (): str => Modal.plan,
    setPlan: (plan: str): void => void (Modal.plan = plan),

    getIsMonthlyPlan: (): bool => Modal.isMonthlyPlan,
    toggleIsMonthlyPlan: (): void =>
      void (Modal.isMonthlyPlan = !Modal.isMonthlyPlan),

    init: function () {
      Helpers.changeStepViews();
    },
  };

  // Step 1 Views
  const StepOneViews: Views = {
    init: function () {
      console.log("StepOneViews.init");
      $(".form__action--back")!.removeEventListener(
        "click",
        Helpers.decreaseStep
      );
    },

    render: function (): void {
      console.log("StepOneViews.render");
      const form: Form = $(".form")!;
      const { name, email, phone } = form.elements;
      const msgClassName = "form__step--1__control__msg";

      if (!form.checkValidity()) {
        [name, email, phone].forEach((input: input) => {
          const parent = input.parentElement as label;
          const msgRef: ele | null = parent.querySelector(`.${msgClassName}`);
          const msg: str = !input.value ? "This field is required" : "Enter a valid value"; // prettier-ignore
          const msgEle: str = `<p role="alert" aria-live="assertive" class="${msgClassName}">${msg}</p>`;

          !input.checkValidity()
            ? !msgRef
              ? (parent.innerHTML += msgEle)
              : (msgRef.innerHTML = msg)
            : msgRef?.remove();
        });
      } else {
        Helpers.increaseStep();
        $$(`.${msgClassName}`).forEach((msg) => msg && msg.remove());
      }
    },
  };

  // Step 2 Views
  const StepTwoViews: Views = {
    init: function () {
      console.log("StepTwoViews.init");
      const {  decreaseStep, thanksStep, togglePlan } = Helpers; // prettier-ignore

      $(".form__action--back")!.addEventListener("click", decreaseStep);
      ($(".form__step--2__plan__checkbox")! as btn).onclick = togglePlan;
      $(".form__action--submit")!.removeEventListener("click", thanksStep);
    },

    render: function () {
      console.log("StepTwoViews.render");
      Helpers.increaseStep();
    },
  };

  // Step 3 Views
  const StepThreeViews: Views = {
    init: function () {
      console.log("StepThreeViews.init");
      $(".form__action--submit")!.removeEventListener(
        "click",
        Helpers.thanksStep
      );
    },

    render: function () {
      console.log("StepThreeViews.render");
      Helpers.increaseStep();
    },
  };

  // Step 4 Views
  const StepFourViews: Views = {
    init: function () {
      console.log("StepFourViews.init");

      Helpers.showSummary();
      $(".form__action--submit")!.addEventListener("click", Helpers.thanksStep);
      ($(".form__summary__plan__change") as btn).onclick = () => {
        Controller.setStep(1);
        Helpers.changeStepViews();
      };
    },

    render: function () {
      console.log("StepFourViews.render");
    },
  };

  const Helpers: HelpersInterface = {
    stepsViews: [StepOneViews, StepTwoViews, StepThreeViews, StepFourViews],
    changeStepViews: function () {
      $(".loader")!.removeAttribute("hidden");

      this.handleStepEvents();
      $("[data-step]")!.setAttribute(
        "data-step",
        String(Controller.getStep() + 1)
      );

      let timer = setTimeout(() => {
        $(".loader")!.setAttribute("hidden", "");
        clearTimeout(timer);
      }, 0);
    },
    handleStepEvents: function () {
      const step = Controller.getStep();
      this.stepsViews[step].init();
      ($(`.form__action--next`)! as btn).onclick = this.stepsViews[step].render;
    },
    increaseStep: function () {
      Controller.setStep(Controller.getStep() + 1);
      this.changeStepViews();
    },
    decreaseStep: function () {
      Controller.setStep(Controller.getStep() - 1);
      Helpers.changeStepViews();
    },
    thanksStep: () => {
      $(".form")!.remove();
      $(".thanks")!.removeAttribute("hidden");
    },
    togglePlan: (e: eve) => {
      Controller.toggleIsMonthlyPlan();
      const checkbox: btn = e.currentTarget as btn;
      const isChecked: bool = Controller.getIsMonthlyPlan();
      const plan: str = isChecked ? "annually" : "monthly";

      Controller.setPlan(plan);
      checkbox.ariaChecked = String(isChecked);
      checkbox.ariaLabel = `Toggle to ${plan} plan`;
    },
    showSummary: () => {
      let total: num = 0;
      const plan = Controller.getPlan();
      const shortPlan = Controller.getIsMonthlyPlan() ? "yr" : "mo";
      const getPrice = (ele: input): str =>
        ele.getAttribute(`data-${plan}-price`) as str;
      const getPriceText = (price: str): str => `$${price}/${shortPlan}`;

      // [1] Plan
      const planEle: input = $("[name='plan']:checked")!;
      const price = getPrice(planEle);
      total += +price;
      $(".form__summary__plan__name")!.innerHTML = `${planEle.value} (${plan})`;
      $(".form__summary__plan__price")!.innerHTML = getPriceText(price);

      // [2] Adds
      let children: str = "";
      const adds: NodeListOf<input> = $$('[name="add-ons"]:checked');
      if (adds.length) {
        adds.forEach((add: input): void => {
          const price = getPrice(add);
          total += +price;
          children += `<div class="form__summary__add">
            <span class="form__summary__add__name">${add.value}</span>
            <span class="form__summary__add__price">+${getPriceText(
              price
            )}</span>
          </div>`;
        });
      } else {
        children = `<p class="form__summary__no_add">No add-ons added</p>`;
      }

      $(".form__summary__adds")!.innerHTML = children;

      // [3] Total
      $(".form__summary__total__title")!.innerHTML = `Total (per ${
        Controller.getIsMonthlyPlan() ? "year" : "month"
      })`;
      $(".form__summary__total__price")!.innerHTML = getPriceText(
        String(total)
      );
    },
  };

  // Trigger form logic
  Controller.init();
})();
