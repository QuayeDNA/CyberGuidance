import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { FiPhone, FiVideo, FiMic, FiPaperclip, FiSend, FiMoreHorizontal } from "react-icons/fi"

export default function Component() {
  return (
    <div className="flex h-[80vh] w-full max-w-[1200px] overflow-hidden rounded-2xl bg-background shadow-lg">
      <div className="flex w-[300px] flex-col border-r bg-muted">
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">John Doe</div>
            <div className="text-sm text-muted-foreground">Online</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <FiMoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="grid gap-2 p-4">
            <Link href="#" className="flex items-center gap-4 rounded-md p-3 hover:bg-muted/50" prefetch={false}>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">Jane Doe</div>
                <div className="text-sm text-muted-foreground">Hey, how's it going?</div>
              </div>
              <div className="text-xs text-muted-foreground">2:34 PM</div>
            </Link>
            <Link href="#" className="flex items-center gap-4 rounded-md p-3 hover:bg-muted/50" prefetch={false}>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">John Smith</div>
                <div className="text-sm text-muted-foreground">Did you see the new design?</div>
              </div>
              <div className="text-xs text-muted-foreground">1:22 PM</div>
            </Link>
            <Link href="#" className="flex items-center gap-4 rounded-md p-3 hover:bg-muted/50" prefetch={false}>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">Sarah Lee</div>
                <div className="text-sm text-muted-foreground">Let's discuss the project timeline.</div>
              </div>
              <div className="text-xs text-muted-foreground">11:45 AM</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-4 border-b bg-background p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">Jane Doe</div>
            <div className="text-sm text-muted-foreground">Online</div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <FiPhone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <FiVideo className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 rounded-md bg-muted p-3">
                <div className="font-medium">Jane Doe</div>
                <div>Hey, how's it going?</div>
                <div className="text-xs text-muted-foreground">2:34 PM</div>
              </div>
            </div>
            <div className="flex items-start gap-4 justify-end">
              <div className="grid gap-1 rounded-md bg-primary p-3 text-primary-foreground">
                <div className="font-medium">You</div>
                <div>I'm doing great, thanks for asking!</div>
                <div className="text-xs">2:35 PM</div>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 rounded-md bg-muted p-3">
                <div className="font-medium">Jane Doe</div>
                <div>Did you see the new design?</div>
                <div className="text-xs text-muted-foreground">2:36 PM</div>
              </div>
            </div>
            <div className="flex items-start gap-4 justify-end">
              <div className="grid gap-1 rounded-md bg-primary p-3 text-primary-foreground">
                <div className="font-medium">You</div>
                <div>Yes, I really like the new look!</div>
                <div className="text-xs">2:37 PM</div>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 flex items-center gap-2 border-t bg-background p-4">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-full bg-muted px-4 py-2 focus:outline-none"
          />
          <Button variant="ghost" size="icon" className="rounded-full">
            <FiPaperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <FiMic className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <FiSend className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
