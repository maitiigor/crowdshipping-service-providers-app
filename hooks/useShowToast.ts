// import { useToast } from "../components/ui/toast/index";
// import { LucideIcon } from "lucide-react-native";
// import CustomToast from "../components/Custom/CustomToast";


// type ToastAction = "error" | "success" | "info" | "muted" | "warning";
// type ToastVariant = "solid" | "outline";


// /**
//  * useShowToast - reusable hook for showing styled toasts.
//  * Example usage:
//  * const showToast = useShowToast();
//  * showToast({ title: "Success", description: "Profile updated!", icon: Check });
//  */
// export const useShowToast = () => {
//   const toast = useToast();

//   const showNewToast = ({
//     title,
//     description,
//     icon,
//     action = "error",
//     variant = "solid",
//   }: {
//     title: string;
//     description: string;
//     icon: LucideIcon;
//     action: ToastAction;
//     variant: ToastVariant;
//   }) => {
//     const newId = Math.random();
//     toast.show({
//       id: newId.toString(),
//       placement: "top",
//       duration: 3000,
//       render: ({ id }) => {
//         const uniqueToastId = "toast-" + id;
//         return (
//           <CustomToast 
//             uniqueToastId={uniqueToastId}
//             icon={icon}
//             action={action}
//             title={title}
//             variant={variant}
//             description={description}
//           />
//         );
//       },
//     });
//   };

//   return showNewToast;
// };
