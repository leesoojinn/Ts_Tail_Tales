// import React from "react";
// import { useMutation, useQueryClient } from "react-query";
// import { supabase } from "../../supabase"; // Supabase 클라이언트 임포트
// import Swal from "sweetalert2";

// interface DeleteProps {
//   id: string;
//   onDelete: () => void;
// }

// export default function Delete({ id, onDelete }: DeleteProps) {
//   const queryClient = useQueryClient();

//   const deleteCommentMutation = useMutation(
//     async () => {
//       try {
//         // Supabase를 사용하여 댓글 삭제
//         const { error } = await supabase.from("comments").delete().eq("id", id);

//         if (error) {
//           Swal.fire({
//             position: "center",
//             icon: "error",
//             title: "댓글 삭제 중 오류 발생",
//             showConfirmButton: false,
//             timerProgressBar: true,
//             timer: 3000,
//           });
//           throw new Error("댓글 삭제 오류");
//         }
//       } catch (error) {
//         Swal.fire({
//           position: "center",
//           icon: "error",
//           title: "댓글 삭제 중 오류 발생",
//           showConfirmButton: false,
//           timerProgressBar: true,
//           timer: 3000,
//         });
//         throw error;
//       }
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("comments");
//         onDelete(); // 삭제 후에 onDelete 함수 호출
//       },
//     }
//   );

//   // const handleDelete = async () => {
//   //   Swal.fire({
//   //     title: "정말 삭제하시겠습니까?",
//   //     icon: "question",
//   //     showCancelButton: true,
//   //     confirmButtonColor: "#3085d6",
//   //     cancelButtonColor: "#d33",
//   //     confirmButtonText: "삭제",
//   //     cancelButtonText: "취소",
//   //   }).then(async (result) => {
//   //     if (result.isConfirmed) {
//   //       try {
//   //         await deleteCommentMutation.mutateAsync();
//   //         Swal.fire({
//   //           position: "center",
//   //           icon: "success",
//   //           title: "삭제가 완료되었습니다.",
//   //           showConfirmButton: false,
//   //           timerProgressBar: true,
//   //           timer: 1500,
//   //         });
//   //       } catch (error) {
//   //         // 삭제 오류 시 SweetAlert로 오류 메시지 표시
//   //         Swal.fire({
//   //           title: "댓글 삭제 오류",
//   //           icon: "error",
//   //         });
//   //       }
//   //     }
//   //   });
//   // };

//   // return <button onClick={handleDelete}>삭제</button>;

//   const handleDelete = async () => {
//     if (window.confirm("정말 삭제하시겠습니까??")) {
//       try {
//         await deleteCommentMutation.mutateAsync();
//       } catch (error) {
//         alert("댓글 삭제 오류");
//       }
//     }
//   };

//   // return <button onClick={handleDelete}>삭제</button>;
// }
export {};

// 없어도 되는 컴포넌트
