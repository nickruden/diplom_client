import { AuthLayout } from '../../../common/components';
import { AuthModule } from '../../../modules/Auth';

export function AuthPage() {
  return (
    <AuthLayout>
        <AuthModule />
    </AuthLayout>
  )
}
