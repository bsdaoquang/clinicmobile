import {HandleAPI} from '../apis/handleAPI';
import {addProfile} from '../redux/reducers/profileReducer';

export const getProfileData = async (id: string, dispatch: any) => {
  try {
    const res = await HandleAPI(`/doctors/profile?id=${id}`);
    if (res && res.data) {
      dispatch(addProfile(res.data));
    }
  } catch (error) {
    console.log(`Không thể tải dữ liệu ${error}`);
  }
};
