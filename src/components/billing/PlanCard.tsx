import type { Plan } from '../../api/billing';

export default function PlanCard({
  plan,
  isCurrent,
  onSelect,
}: {
  plan: Plan;
  isCurrent: boolean;
  onSelect?: () => void;
}) {
  return (
    <div
      className={`border bg-surface-container p-6 ${
        isCurrent ? 'border-primary' : 'border-outline-variant'
      }`}
    >
      <h3 className="font-heading text-lg font-semibold text-on-surface">{plan.name}</h3>
      <p className="mt-2 font-heading text-[28px] font-bold text-on-surface">
        ${plan.price}
        <span className="text-sm font-normal text-outline">/mo</span>
      </p>

      <ul className="mt-5 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span className="text-xs text-tertiary">&#10003;</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-1.5">
        <p className="font-mono text-[11px] text-outline">
          {plan.limits.requestsPerMonth.toLocaleString()} requests/mo
        </p>
        <p className="font-mono text-[11px] text-outline">
          {plan.limits.tokensPerMonth.toLocaleString()} tokens/mo
        </p>
        <p className="font-mono text-[11px] text-outline">{plan.limits.apiKeys} API keys</p>
        <p className="font-mono text-[11px] text-outline">{plan.limits.teamMembers} team members</p>
      </div>

      {isCurrent ? (
        <div className="mt-5 flex h-10 items-center justify-center border border-primary text-sm text-primary">
          Current Plan
        </div>
      ) : onSelect ? (
        <button
          onClick={onSelect}
          className="mt-5 h-10 w-full bg-primary font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110"
        >
          UPGRADE
        </button>
      ) : null}
    </div>
  );
}
