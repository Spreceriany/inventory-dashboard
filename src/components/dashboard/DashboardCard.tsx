import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  color?: string;
  icon?: React.ReactNode;
}

function DasboardCard({ title, value, subtext, color, icon }: KpiCardProps) {
  return (
    <>
      <Card className={` ${color ?? "bg-secondary"}`}>
        <CardHeader>
          {icon && icon}
          <CardTitle className=" text-black text-2xl md:text-3xl font-bold">
            {value}
          </CardTitle>
          <CardDescription className="text-gray-700">{title}</CardDescription>
          {subtext && <CardContent>{subtext}</CardContent>}
        </CardHeader>
      </Card>
    </>
  );
}

export default DasboardCard;
