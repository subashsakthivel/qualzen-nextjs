import { authClient } from '@/lib/auth-client'
import { TUserInfo } from '@/schema/UserInfo';
import DataClientAPI from '@/util/client/data-client-api';
import React from 'react'
import QRCode from 'react-qr-code';

const TwoFactor = () => {

    const [userInfo, setUserInfo] = React.useState<TUserInfo | undefined>(undefined)
    const [totpUri, setTotpUri] = React.useState<string | undefined>(undefined)
    const [backupCode, setBackupCode] = React.useState<string[]>([])

    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession();

    const enableTwoFactor = async (formdata: FormData) => {
        const twofactor = await authClient.twoFactor.enable({
            password: formdata.get("password") as string,
            issuer: "qualzen"
        })
        if (twofactor.data) {
            setTotpUri(twofactor.data?.totpURI)
            setBackupCode(twofactor.data?.backupCodes)
        } else {
            alert("Not able to enable two factor authentication")
        }
    }

    const verifyTOTP = async (formdata: FormData) => {
        const data = await authClient.twoFactor.verifyTotp({
            code: formdata.get("code") as string,
            trustDevice: true
        })
    }

    const getUserInfo = async (id: string) => {
        const response = await DataClientAPI.getData({
            modelName: "userinfo",
            id: id,
            request: {}
        });
        setUserInfo(response.data);
    }

    if (session && session.user.twoFactorEnabled && session.user.id) {
        getUserInfo(session.user.id);
    }

    if (isPending) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }


    return (
        <div>
            {(userInfo && userInfo.role == "admin" && session && !session.user.twoFactorEnabled) && <div>
                <form action={enableTwoFactor}>
                    <input type="password" placeholder="Enter your password" />
                    <button type="submit">Enable Two Factor Authentication</button>
                </form>
                {totpUri && (
                    <div>
                        <QRCode value={totpUri} />
                    </div>
                )}
                {backupCode.length > 0 && (
                    <div>
                        {backupCode.map((code, index) => (
                            <div key={index}>{code}</div>
                        ))}
                    </div>
                )}
            </div>}
            <form action={verifyTOTP}>
                <input type="text" name='code' />
                <button type="submit">Verify</button>
            </form>
        </div>
    )
}

export default TwoFactor