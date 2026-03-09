"use client";
import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query";
import QRCode from "react-qr-code";

export default function QRUserCard({ password }: { password: string }) {
    const { data: session } = authClient.useSession();
    const { data: qr } = useQuery({
        queryKey: ["two-factor-qr"],
        queryFn: async () => {
            const res = await authClient.twoFactor.getTotpUri({ password });
            return res.data;
        },
        enabled: !!session?.user.twoFactorEnabled,
    });
    return (
        <QRCode value={qr?.totpURI || ""} />
    )
}