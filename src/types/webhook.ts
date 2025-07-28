export interface WebhookEntry {
  messaging: MessagingEvent[];
}

export interface MessagingEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: MessageEvent;
  postback?: PostbackEvent;
}

export interface MessageEvent {
  mid: string;
  text?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  type: string;
  payload: {
    url?: string;
  };
}

export interface PostbackEvent {
  title: string;
  payload: string;
}

export interface MessageResponse {
  text?: string;
  attachment?: any;
  quick_replies?: QuickReply[];
}

export interface QuickReply {
  content_type: string;
  title: string;
  payload: string;
}

export interface SendAPIRequest {
  recipient: { id: string };
  message: MessageResponse;
}
