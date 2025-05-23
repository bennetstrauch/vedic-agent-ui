export interface Message {
  sender: "user" | "agent";
  content: string;
}
