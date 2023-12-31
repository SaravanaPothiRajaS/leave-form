
import * as Yup from "yup";


export const leaveSchema = Yup.object().shape({
  leaveType: Yup.string().required('* leave type is required'),
  department: Yup.string().required('* Id is required'),
  fromDate: Yup.date().required('* From Date is required'),
  toDate: Yup.date().required('* To Date is required'),
  totalDays: Yup.number().required('* Total Days is required'),
  reason: Yup.string().required('* Reason is required'),
  approver: Yup.string().required('* To Whom is required'),
});


export async function validateUserEdit(data) {
  try {
    let validatedUser = await leaveSchema.validate(data, {
      abortEarly: false,
    });
    return validatedUser;
  } catch (error) {
    throw error;
  }
}



  export const holidaySchema = Yup.object().shape({
    Date:Yup.date().required('Date is required'),
    Day: Yup.string().required('Day is required'),
    Description:Yup.string().required('Description is required')


});

export async function validateUserholiday(data) {
  try {
    let validatedUser = await holidaySchema.validate(data, {
      abortEarly: false,
    });
    return validatedUser;
  } catch (error) {
    throw error;
  }
}