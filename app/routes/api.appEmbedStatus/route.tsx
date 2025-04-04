import { json } from '@remix-run/node';
import { fetchAppEmbedBlock } from 'app/controller/themes/fetchAppEmbedBlock';

interface LoaderResponse {
    success: boolean;
    message: string | null;
    appBlock: any;
    appEmbedID: string;
}

export const loader = async ({
    request,
}: {
    request: Request;
}): Promise<Response> => {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop') ?? '';
    const getAppEmbedResponse = await fetchAppEmbedBlock(shop);
    return json<LoaderResponse>(getAppEmbedResponse);
};