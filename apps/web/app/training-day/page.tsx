import type { Metadata } from 'next';
import { TrainingDay } from './view';

export const metadata: Metadata = { title: 'Training day' };

export default function TrainingDayPage() {
  return <TrainingDay />;
}
