import { AppLayout } from '../../../common/components';
import { AuthModule } from '../../../modules/Auth';

export function AuthPage() {
  return (
    <AppLayout>
        <AuthModule />
    </AppLayout>
  )
}
