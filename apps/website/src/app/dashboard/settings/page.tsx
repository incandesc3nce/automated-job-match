import { SettingsForm } from '@/components/dashboard/settings/SettingsForm';
import { Typography } from '@/components/ui/typography';
import { Email } from '@/types/common/Email';
import { Username } from '@/types/common/Username';
import { ServerAPIFetch } from '@/utils/ServerAPIFetch';

export default async function SettingsPage() {
  const userInfo = await ServerAPIFetch<{
    id: string;
    email: Email;
    name: Username;
  }>('/api/v1/users/me');
  return (
    <div className='px-4 my-2'>
      <Typography tag="h2">Настройки</Typography>
      <div className='my-2 max-w-md'>
        {userInfo.success && (
          <SettingsForm name={userInfo.data.name} email={userInfo.data.email} />
        )}
        {!userInfo.success && <SettingsForm name="" email="" />}
      </div>
    </div>
  );
}
