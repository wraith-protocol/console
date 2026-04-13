import { useQuery, useMutation } from '@tanstack/react-query';
import { useTeam } from '../hooks/useTeam';
import { getPlans, getCurrentBilling, createCheckout, createPortalSession } from '../api/billing';
import PlanCard from '../components/billing/PlanCard';
import UsageMeter from '../components/billing/UsageMeter';

export default function Billing() {
  const { currentTeam } = useTeam();
  const teamId = currentTeam?.id;

  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
  });

  const { data: billing, isLoading } = useQuery({
    queryKey: ['billing', teamId],
    queryFn: () => getCurrentBilling(teamId!),
    enabled: !!teamId,
  });

  const checkoutMutation = useMutation({
    mutationFn: (planId: string) => createCheckout(teamId!, planId),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  const portalMutation = useMutation({
    mutationFn: () => createPortalSession(teamId!),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  if (isLoading) {
    return <p className="text-sm text-outline">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {billing && (
        <div className="border border-outline-variant bg-surface-container p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-semibold text-on-surface">
                Current Plan: {billing.plan.name}
              </h3>
              <p className="text-xs text-outline">
                Period ends {new Date(billing.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            {billing.stripeCustomerId && (
              <button
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
                className="border border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-bright"
              >
                Manage Subscription
              </button>
            )}
          </div>
          <div className="space-y-3">
            <UsageMeter
              label="Requests"
              current={billing.usage.requests}
              limit={billing.plan.limits.requestsPerMonth}
            />
            <UsageMeter
              label="Tokens"
              current={billing.usage.tokens}
              limit={billing.plan.limits.tokensPerMonth}
            />
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-4 font-heading text-sm font-semibold text-on-surface">Plans</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={billing?.plan.id === plan.id}
              onSelect={
                billing?.plan.id !== plan.id ? () => checkoutMutation.mutate(plan.id) : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
