import React from 'react'
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export interface CustomCardProps{
    LeftTop: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    RightTop?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    titleForBadge?: string | React.ReactElement;
    CompleteBadge?: React.ReactElement;
    titleForCard: string;
    subtitleForCard: string;
    miniDescriptionForCard: string;
}

export const CustomCard = ({ LeftTop, RightTop, titleForBadge, titleForCard, subtitleForCard, miniDescriptionForCard, CompleteBadge } : CustomCardProps) => {
  return (
   <Card className="card-warm p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <LeftTop className="w-8 h-8 text-primary" />
            {
                typeof RightTop === "function" ? <RightTop className="w-8 h-8 text-primary" /> :
               <>
                {CompleteBadge ? CompleteBadge : (
                    <Badge className="bg-primary text-white dark:text-black font-ui font-semibold px-3 py-1 rounded-lg">
                        {titleForBadge}
                    </Badge>
                )}
                </>
            }
          </div>
          <div className="space-y-2">
            <h3 className="font-body text-3xl text-foreground">{titleForCard}</h3>
            <p className="font-ui font-semibold text-foreground">{subtitleForCard}</p>
            <p className="font-ui text-sm text-muted-foreground">{miniDescriptionForCard}</p>
          </div>
        </Card>
  )
}
