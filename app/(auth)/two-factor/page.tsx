import TwoFactor from '@/components/auth/two-factor';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

const TwoFactorPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/signin")
    }

    return (
        <TwoFactor id={session?.user.id} twoFactorEnabled={session?.user.twoFactorEnabled === true} />
    )
}

export default TwoFactorPage