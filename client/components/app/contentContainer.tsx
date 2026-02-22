import { View } from "react-native";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <View className={`flex-1 self-center w-full max-w-lg ${className}`}>
      {children}
    </View>
  );
};

export default ContentContainer;
