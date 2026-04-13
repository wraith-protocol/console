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
      <p className="mt-1 text-2xl font-semibold text-on-surface">
        ${plan.price}
        <span className="text-sm font-normal text-outline">/mo</span>
      </p>

      <ul className="mt-4 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span className="text-tertiary">&#10003;</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1 text-xs text-outline">
        <p>{plan.limits.requestsPerMonth.toLocaleString()} requests/mo</p>
        <p>{plan.limits.tokensPerMonth.toLocaleString()} tokens/mo</p>
        <p>{plan.limits.apiKeys} API keys</p>
        <p>{plan.limits.teamMembers} team members</p>
      </div>

      {isCurrent ? (
        <div className="mt-4 border border-primary px-4 py-2 text-center text-sm text-primary">
          Current Plan
        </div>
      ) : onSelect ? (
        <button
          onClick={onSelect}
          className="mt-4 w-full bg-primary px-4 py-2 text-sm font-medium text-surface hover:bg-primary/90"
        >
          Upgrade
        </button>
      ) : null}
    </div>
  );
}
