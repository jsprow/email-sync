export interface IMessage {
  isRead: boolean;
  from: { emailAddress: { addresss: string; name: string } };
  receivedDateTime: string;
  subject: string;
}

export interface IAttendee {
  emailAddress: { address: string; name: string };
}

export interface IEvent {
  subject: {
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
  };
  attendees: IAttendee[];
}

export interface IParams {
  active: { [key: string]: boolean };
  debug?: string;
  error?: { status: string };
  events?: IEvent[];
  message?: string;
  messages?: () => IterableIterator<IMessage>;
  signInUrl?: string;
  title: string;
  user?: string;
}
