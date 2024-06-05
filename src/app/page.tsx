import { Typography } from '@casar/ui-kit/typography';
import { FormComponent } from './_components/form';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-24 text-neutral">
      <Typography type='title'>Spike</Typography>

      <FormComponent />
    </main>
  );
}
