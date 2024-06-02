import 'next';

declare module 'next' {
  interface NextApiRequest {
    session: any;
  }

  interface NextApiResponse {
    session: any;
  }
}
