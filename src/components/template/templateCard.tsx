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
        className="relative z-20 aspect-video w-full object-cover brightness-55 grayscale"
      />
      <CardHeader>
        {/* FIXME: shadcn did not export CardAction */}
        {/* <CardAction>
          <Badge variant="secondary">{template.tag}</Badge>
        </CardAction> */}
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={template.path}>查看模板</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
