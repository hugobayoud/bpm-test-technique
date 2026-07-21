import { PlaceholderScreen } from '@/components/placeholder-screen';
import { COACH_TITLE } from '@/features/coach/constants';

// Pushed by the filters screen's coach CTA — replaced by the real coach
// screen in issue 019.
export default function CoachRoute() {
  return <PlaceholderScreen showBack title={COACH_TITLE} />;
}
