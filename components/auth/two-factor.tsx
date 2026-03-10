"use client";
import { authClient } from '@/lib/auth-client'
import { TUserInfo } from '@/schema/UserInfo';
import DataClientAPI from '@/util/client/data-client-api';
import React, { useEffect } from 'react'
import QRCode from 'react-qr-code';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';


const TwoFactor = ({ id, twoFactorEnabled = false }: { id: string, twoFactorEnabled: boolean }) => {

    const [userInfo, setUserInfo] = React.useState<TUserInfo | undefined | null>(undefined)
    const [totpUri, setTotpUri] = React.useState<string | undefined>(undefined)
    const [backupCode, setBackupCode] = React.useState<string[]>([])
    const router = useRouter();
    const enableTwoFactor = async (formdata: FormData) => {
        const twofactor = await authClient.twoFactor.enable({
            password: formdata.get("password") as string,
            issuer: "qualzen"
        })
        if (twofactor.data) {
            setTotpUri(twofactor.data?.totpURI)
            setBackupCode(twofactor.data?.backupCodes)
        } else {
            alert("Not able to enable two factor authentication. Make sure your password is correct")
        }
    }

    const verifyTOTP = async (formdata: FormData) => {
        const data = await authClient.twoFactor.verifyTotp({
            code: formdata.get("code") as string,
            trustDevice: false
        })
        if (data.error) {
            alert(data.error.message)
        } else {
            router.push("/")
        }
    }

    useEffect(() => {
        const getUserInfo = async (id: string) => {
            const response = await DataClientAPI.getData({
                modelName: "userinfo",
                operation: "GET_DATA_ONE",
                request: {
                    options: {
                        filter: { userId: id }
                    }
                }
            });
            console.log(response)
            setUserInfo(response);
        }
        getUserInfo(id);
    }, [id])

    if (userInfo == undefined) {
        return <div>Loading...</div>
    }

    if (userInfo && userInfo.role != "admin") {
        return <h1>404 Bad Request</h1>
    }

    return (
        <div className='grid gap-3'>
            {(userInfo && userInfo.role == "admin" && id && !twoFactorEnabled) && <div>
                <form action={enableTwoFactor} className='grid gap-3'>
                    <Input name='password' type="password" placeholder="Enter your password" />
                    <Button type="submit">Enable Two Factor Authentication</Button>
                </form>
                {totpUri && (
                    <div className='m-4'>
                        <QRCode value={totpUri} />
                    </div>
                )}
                {backupCode.length > 0 && (
                    <div className='m-4'>
                        <div className='font-bold text-center'>Backup Code</div>
                        {backupCode.map((code, index) => (
                            <div key={index}>{code}</div>
                        ))}
                    </div>
                )}
            </div>}
            {(userInfo) && <form action={verifyTOTP} className='gird gap-3'>
                <Input type="text" name='code' placeholder='eg:1234565' className='mb-2' />
                <Button type="submit">Verify</Button>
            </form>}
        </div>
    )
}

export default TwoFactor