import {Row, Section, Space} from '@bsdaoquang/rncomponent';
import {TickCircle} from 'iconsax-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ButtonComponent, Input, Tag, TextComponent} from '.';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import {Select} from '../models/Select';
import {SelectModel} from '../models/SelectModel';
import {globalStyles} from '../styles/globalStyles';
import {replaceName} from '../utils/replaceName';

interface Props {
  data: Select;
  onSelect: (val: string | string[]) => void;
  selected: string | string[];
  placeholder?: string;
  multible?: boolean;
  label?: string;
  type?: 'button' | 'link' | 'input';
  disable?: boolean;
  inline?: boolean;
}

export const DropdownPicker = (props: Props) => {
  const {
    data,
    onSelect,
    selected,
    placeholder,
    multible,
    label,
    type,
    disable,
    inline,
  } = props;

  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<SelectModel[]>(data.values ?? []);
  const [itemsSelected, setItemsSelected] = useState<string[]>([]);

  const modalizeRef = useRef<Modalize>();

  useEffect(() => {
    if (multible && typeof selected === 'object' && selected.length > 0) {
      const items = [...itemsSelected];

      selected.forEach(i => i && !items.includes(i) && items.push(i));

      setItemsSelected(items);
    }
  }, [selected, multible]);

  useEffect(() => {
    if (!searchKey) {
      setResults(data.values);
    } else {
      const items = data.values.filter(element =>
        replaceName(element.label).includes(replaceName(searchKey)),
      );

      setResults(items);
    }
  }, [searchKey]);

  const renderSelectedLabel = (id: string) => {
    const item = data.values.find(element => element.value === id);

    return item ? item?.label : '';
  };

  const handleSelectItem = (id: string) => {
    const items = [...itemsSelected];

    const index = itemsSelected.findIndex(element => `${element}` === `${id}`);

    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(id);
    }

    setItemsSelected(items);
    let values = ``;
    items.forEach(
      (value, index) =>
        (values += `${value}${index < items.length - 1 ? ';' : ''}`),
    );

    onSelect(values);
  };

  const renderTagComponent = (id: string) => {
    const item: any = data.values.find((element: any) => element.value === id);

    return (
      item && (
        <Tag
          onPress={disable ? undefined : () => handleSelectItem(id)}
          text={item.label}
          onClose={disable ? undefined : () => handleSelectItem(id)}
          key={item.value}
          textColor={`${colors.primary}80`}
          color={`${colors.blue10}`}
        />
      )
    );
  };

  return (
    <>
      {!type || type === 'input' ? (
        <>
          {label && (
            <TextComponent
              text={label}
              type="title"
              size={14}
              font={fontFamilies.medium}
            />
          )}
          <Row
            justifyContent="flex-start"
            onPress={
              disable
                ? undefined
                : () => {
                    modalizeRef.current?.open();
                  }
            }
            styles={[
              globalStyles.inputContainer,
              {
                minHeight: 48,
                marginBottom: inline ? 0 : 12,
                borderColor: disable ? colors.gray90 : colors.gray70,
                backgroundColor: disable ? colors.gray90 : colors.white,
              },
            ]}>
            {multible ? (
              <View style={{flex: 1}}>
                <Row styles={{flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                  {itemsSelected.length > 0 ? (
                    itemsSelected.map((item: string) =>
                      renderTagComponent(item),
                    )
                  ) : (
                    <TextComponent
                      text={placeholder ?? 'Chọn'}
                      flex={1}
                      color={colors.gray70}
                    />
                  )}
                </Row>
              </View>
            ) : (
              <TextComponent
                numberOfLine={1}
                text={
                  selected
                    ? renderSelectedLabel(selected as string)
                    : placeholder ?? ''
                }
                flex={1}
                color={selected ? colors.primary : colors.gray70}
                font={fontFamilies.medium}
              />
            )}

            <Space width={8} />
            <MaterialIcons
              name="arrow-drop-down"
              size={24}
              color={colors.gray50}
            />
          </Row>
        </>
      ) : type === 'button' ? (
        <></>
      ) : (
        <Row
          styles={{}}
          onPress={disable ? undefined : () => modalizeRef.current?.open()}>
          <TextComponent
            text={
              label
                ? label
                : data.values.find(element => element.value === selected)
                    ?.label ?? ''
            }
            font={fontFamilies.medium}
            color={disable ? colors.dark10 : colors.primary}
          />
          <Space width={4} />
          <FontAwesome5
            name="caret-down"
            size={18}
            color={disable ? colors.dark10 : colors.primary}
          />
        </Row>
      )}

      <Portal>
        <Modalize
          panGestureEnabled={true}
          closeOnOverlayTap
          onClose={() => {}}
          avoidKeyboardLikeIOS
          adjustToContentHeight
          disableScrollIfPossible={false}
          handlePosition="inside"
          ref={modalizeRef}
          HeaderComponent={
            <Row
              styles={[
                globalStyles.borderBottom,
                {
                  padding: 16,
                },
              ]}>
              <TextComponent
                type="title"
                bottom={0}
                text={data.title}
                size={16}
                styles={{marginBottom: 0}}
                flex={1}
              />
              <ButtonComponent
                icon={
                  <AntDesign name="close" color={colors.dark20} size={22} />
                }
                onPress={() => modalizeRef.current?.close()}
              />
            </Row>
          }
          FooterComponent={
            multible && data.values.length > 0 ? (
              <>
                <Section styles={{paddingTop: 20}}>
                  <ButtonComponent
                    text="Đồng ý"
                    onPress={() => {
                      // onSelect(itemsSelected);
                      modalizeRef.current?.close();
                    }}
                    type="primary"
                  />
                </Section>
              </>
            ) : undefined
          }
          flatListProps={{
            data: searchKey ? results : data.values,
            ListEmptyComponent: (
              <Section>
                <TextComponent text="Dữ liệu trống" />
              </Section>
            ),
            ListHeaderComponent: (
              <View style={{paddingHorizontal: 16, paddingTop: 12}}>
                <Input
                  placeholder="Tìm kiếm"
                  value={searchKey}
                  onChange={val => setSearchKey(val)}
                  clear
                />
              </View>
            ),
            maxToRenderPerBatch: 20,
            removeClippedSubviews: true,
            renderItem: ({item, index}) => (
              <Row
                onPress={() => {
                  if (multible) {
                    handleSelectItem(item.value);
                  } else {
                    onSelect(item.value);
                    modalizeRef.current?.close();
                  }
                }}
                key={item.value}
                styles={[
                  globalStyles.borderBottom,
                  globalStyles.center,
                  {
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderBottomColor: colors.white93,
                    borderBottomWidth: index < data.values.length - 1 ? 1 : 0,
                  },
                ]}>
                {multible ? (
                  <TextComponent
                    text={item.label}
                    color={
                      itemsSelected && itemsSelected.includes(item.value)
                        ? colors.primary
                        : colors.dark20
                    }
                    flex={1}
                    font={
                      itemsSelected && itemsSelected.includes(item.value)
                        ? fontFamilies.medium
                        : fontFamilies.regular
                    }
                  />
                ) : (
                  <TextComponent
                    text={item.label}
                    color={
                      selected === item.value ? colors.primary : colors.dark20
                    }
                    flex={1}
                    font={
                      selected === item.value
                        ? fontFamilies.medium
                        : fontFamilies.regular
                    }
                  />
                )}
                {itemsSelected && itemsSelected.includes(item.value) && (
                  <TickCircle size={20} color={colors.primary} />
                )}
              </Row>
            ),
            showsVerticalScrollIndicator: false,
          }}
        />
      </Portal>
    </>
  );
};
