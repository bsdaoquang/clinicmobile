import {
  Col,
  DateTime,
  Row,
  Section,
  Space,
  colors,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Container, TextComponent} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import {NotificationModel} from '../../models/NotificationModel';
import {showToast} from '../../utils/showToast';
import {getDateUpdate} from '../../utils/getDateUpdate';

let pageNumber = 1;

const Notifications = ({navigation}: any) => {
  const [totalPages, setTotalPages] = useState(1);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadmore, setIsLoadmore] = useState(false);

  const user = auth().currentUser;
  const fsRef = firestore().collection('notifications');

  useEffect(() => {
    getTotalPage();
    getNotifications(pageNumber);
  }, []);

  const getTotalPage = async () => {
    try {
      const snap = await fsRef
        .where('uid', '==', user?.uid)
        .where('isRead', '==', false)
        .countFromServer()
        .get();

      const count = snap.data().count;
      const pages = Math.ceil(count / 10);
      setTotalPages(pages);
    } catch (error) {
      console.log(error);
    }
  };

  const getNotifications = async (page: number) => {
    setIsLoading(notifications.length === 0);
    await fsRef
      .where('uid', '==', user?.uid)
      .where('isRead', '==', false)
      .orderBy('createdAt')
      .limitToLast(page * 10)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('Notification empty');
        } else {
          const items: NotificationModel[] = [];
          snap.forEach((item: any) => {
            items.unshift({
              id: item.id,
              ...item.data(),
            });
          });

          setNotifications(items);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const handleReadNotification = async (id: string) => {
    try {
      await fsRef.doc(id).update({
        isRead: true,
      });

      const items = [...notifications];
      const index = items.findIndex(element => element.id === id);
      if (index !== -1) {
        items[index].isRead = true;
      }

      setNotifications(items);
    } catch (error: any) {
      showToast(error.message);
      console.log(error);
    }
  };

  const renderNotificationItem = (item: NotificationModel) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          // console.log(item);
          await handleReadNotification(item.id);
          if (item.module) {
            navigation.navigate(item.module);
          }
        }}
        key={item.id}
        style={{
          marginHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 0.5,
          borderBottomColor: '#e0e0e0',
        }}>
        <Row>
          <Col>
            <TextComponent
              text={item.title}
              font={
                item.isRead
                  ? fontFamilies.RobotoRegular
                  : fontFamilies.RobotoMedium
              }
              color={item.isRead ? colors.gray500 : colors.text}
            />
          </Col>
          <Space width={12} />
          <TextComponent
            text={getDateUpdate(item.createdAt)}
            size={12}
            color={colors.gray500}
          />
        </Row>
        <TextComponent
          text={item.body}
          numberOfLine={2}
          color={item.isRead ? colors.gray500 : colors.text}
        />
      </TouchableOpacity>
    );
  };

  const handleReadAll = async () => {
    try {
      const snap = await fsRef
        .where('uid', '==', user?.uid)
        .where('isRead', '==', false)
        .get();

      if (snap.size > 0) {
        snap.forEach(async item => {
          await fsRef.doc(item.id).update({isRead: true});
        });
      }
      showToast('Đánh dấu tất cả thông báo là đã đọc');
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container
      isScroll={false}
      back
      title="Thông báo"
      right={
        notifications.length > 0 && (
          <TouchableOpacity onPress={handleReadAll}>
            <Ionicons
              name="checkmark-done-sharp"
              size={24}
              color={colors.blue400}
            />
          </TouchableOpacity>
        )
      }>
      {isLoading ? (
        <Section flex={1} styles={[globalStyles.center]}>
          <Row>
            <ActivityIndicator color={colors.gray600} />
          </Row>
        </Section>
      ) : (
        <FlatList
          onEndReached={async () => {
            if (pageNumber < totalPages) {
              pageNumber += 1;
              setIsLoadmore(true);
              await getNotifications(pageNumber);

              setIsLoadmore(false);
            }
          }}
          ListFooterComponent={
            isLoadmore ? (
              <Section>
                <ActivityIndicator />
              </Section>
            ) : null
          }
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <Section flex={1} styles={[globalStyles.center]}>
              <TextComponent text="Không có thông báo" />
            </Section>
          }
          showsVerticalScrollIndicator={false}
          data={notifications}
          renderItem={({item}) => renderNotificationItem(item)}
        />
      )}
    </Container>
  );
};

export default Notifications;
