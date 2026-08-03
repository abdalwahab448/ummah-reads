type CameraContainerProps = Readonly<{
  children: React.ReactNode;
}>;

export function CameraContainer({ children }: CameraContainerProps) {
  return <>{children}</>;
}
