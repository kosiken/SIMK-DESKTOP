interface Circle {
  x: number;
  y: number;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees): Circle {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

export default function describeArc(
  x,
  y,
  radius,
  startAngle,
  endAngle
): string {
  const ender = (endAngle / 100) * 360;
  const start = polarToCartesian(x, y, radius, ender);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = ender - startAngle <= 180 ? '0' : '1';

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y
  ].join(' ');

  return d;
}
