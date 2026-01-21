import { TouchableOpacity, Text } from "react-native";
import { useListingDetailsStore } from "../../stores/listingDetailsStore";
import { usePopupStore } from "../../stores/popupStore";
import ActionPopup from "../actionPopup";
import SalePopup from "../salePopup";

const ListingActions = () => {
  const { isEditDetails, setIsEditDetails } = useListingDetailsStore();
  const { open, close } = usePopupStore();
  return (
    <>
      <TouchableOpacity
        className="w-full bg-accent1 flex flex-row items-center justify-center p-4 rounded-3xl gap-2"
        onPress={() => {
          console.log("onPress", isEditDetails);
          if (isEditDetails) {
            setIsEditDetails(false);
            close();
          } else {
            console.log("opening sale popup");
            open(<SalePopup />);
          }
        }}
      >
        <Text className="text-lg font-bold text-dark1">
          {isEditDetails ? "Save" : "Sell"}
        </Text>
      </TouchableOpacity>
      {!isEditDetails && (
        <TouchableOpacity
          className="w-full bg-dark2 flex flex-row items-center justify-center p-4 rounded-3xl gap-2"
          onPress={() => open(<ActionPopup />)}
        >
          <Text className="text-lg font-bold text-light2">More</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ListingActions;
