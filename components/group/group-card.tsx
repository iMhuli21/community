import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export default function GroupCard() {
  return (
    <Card className="max-w-sm w-full">
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4 justify-between ">
          <div className="flex items-start gap-3">
            <Avatar size="lg">
              <AvatarFallback className="bg-green-light text-green font-medium">
                PM
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-0">
              <span className="font-medium">Pimville Ward 45</span>
              <div className="flex items-center gap-1">
                <div className="size-0.5 bg-gray-400 rounded-full"></div>
                <span className="text-muted-foreground text-xs">
                  876 members
                </span>
              </div>
            </div>
          </div>
          <Badge variant={"member"} className="text-xs rounded-sm">
            Member
          </Badge>
        </div>
        <div className="border-t border-line"></div>
        <div className="flex items-center gap-4 justify-between text-muted-foreground tracking-tight font-medium">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-red-600"></div>
            <span className="truncate">
              New report: water outage on Khumalo St
            </span>
          </div>
          <span>14m</span>
        </div>
      </CardContent>
    </Card>
  );
}
