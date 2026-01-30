interface StepperProps {
  steps: string[];
  activeIndex: number;
}

export function Stepper({ steps, activeIndex }: StepperProps) {
  return (
    <div className="mt-6 flex gap-2">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex-1 rounded-full px-3 py-2 text-center text-xs font-medium ${
            index === activeIndex
              ? "bg-brand-100 text-brand-700"
              : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}

