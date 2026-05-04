import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TemplateItem } from "@/types/template";

type TemplateCardProps = {
  template: TemplateItem;
};

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="relative w-full overflow-hidden pt-0 shadow-card">
      <div className="absolute inset-x-0 top-0 z-30 aspect-video bg-black/35" />
      <img
        src={template.previewImage}
        alt={template.name}
        className="relative z-20 aspect-video w-full object-cover brightness-75 grayscale"
      />
      <CardHeader className="grid auto-rows-min grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1.5 p-4">
        <CardTitle className="text-base">{template.name}</CardTitle>
        <CardAction className="col-start-2 col-end-3 row-start-1 row-end-3 self-start justify-self-end">
          <Badge variant="secondary">{template.tag}</Badge>
        </CardAction>
        <CardDescription className="col-span-2 leading-6">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-4">
        <Button asChild className="w-full">
          <Link to={template.path}>查看模板</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
