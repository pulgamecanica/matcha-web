export type ScheduledDate = {
    id: string;
    connection_id: string;
    initiator_id: string;
    location: string;
    scheduled_at: string;
    note: string | null;
    created_at: string;
    partner_username: string;
};

// {
// 	"data": [
// 		{
// 			"id": "5",
// 			"connection_id": "148",
// 			"initiator_id": "58",
// 			"location": "paris",
// 			"scheduled_at": "2025-04-28 10:00:00",
// 			"note": null,
// 			"created_at": "2025-04-28 08:47:04.935588",
// 			"partner_username": "lucius",
// 			"iniciator_username": "lucius"
// 		}
// 	]
// }
  
  export type ScheduledDateResponse = {
    message: string;
    data: ScheduledDate[];
  };
  
  export type SetDatePayload = {
    username: string; 
    scheduled_at: string;
    location?: string;
    note?: string;
  };
  