import {HandleAPI} from '../apis/handleAPI';
import {addProfile} from '../redux/reducers/profileReducer';

export const getProfileData = async (id: string, dispatch: any) => {
  const res = await HandleAPI(`/doctors/profile?id=${id}`);
  if (res && res.data) {
    dispatch(addProfile(res.data));
  }
};
