import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  Button,
  Col,
  globalStyles,
  Input,
  replaceName,
  Row,
  Section,
  SelectModel,
  Space,
} from '@bsdaoquang/rncomponent';
import {TickCircle, TickSquare} from 'iconsax-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import TextComponent from './TextComponent';

interface Props {
  data: {
    title: string;
    values: SelectModel[];
  };
  onSelect: (val: string | string[]) => void;
  selected: string | string[];
  placeholder?: string;
  multible?: boolean;
  label?: string;
  type?: 'button' | 'link' | 'input';
  disable?: boolean;
  inline?: boolean;
  onAddNew?: (val: SelectModel) => void;
}

const DropdownPicker = (props: Props) => {
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
    onAddNew,
  } = props;

  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<SelectModel[]>(data.values ?? []);
  const [itemsSelected, setItemsSelected] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [isAddNewValue, setIsAddNewValue] = useState(false);

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
      const items = data.values.filter((element: any) =>
        replaceName(element.label).includes(replaceName(searchKey)),
      );

      setResults(items);
    }
  }, [searchKey]);

  const renderSelectedLabel = (id: string) => {
    const item = data.values.find((element: any) => element.value === id);

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
        <></>
        // <Tag
        //   onPress={disable ? undefined : () => handleSelectItem(id)}
        //   text={item.label}
        //   onClose={disable ? undefined : () => handleSelectItem(id)}
        //   key={item.value}
        //   textColor={`${colors.primary}80`}
        //   color={`${colors.blue10}`}
        // />
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
              size={14}
              font={fontFamilies.RobotoMedium}
              styles={{marginBottom: 8}}
            />
          )}
          <Row
            justifyContent="flex-start"
            onPress={
              disable
                ? undefined
                : () => {
                    modalizeRef.current?.open();
                    Keyboard.dismiss();
                  }
            }
            styles={[
              globalStyles.inputContainer,
              {
                minHeight: 48,
                marginBottom: inline ? 0 : 12,
                borderColor: disable ? colors.light : `#e0e0e0`,
                backgroundColor: disable ? colors.light : colors.white,
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
                      color={colors.gray}
                    />
                  )}
                </Row>
              </View>
            ) : (
              <Col>
                <TextComponent
                  numberOfLine={1}
                  text={
                    selected
                      ? renderSelectedLabel(selected as string)
                      : placeholder
                      ? placeholder
                      : ''
                  }
                  flex={1}
                  color={selected ? colors.text : colors.gray2}
                />
              </Col>
            )}

            <Space width={8} />
            <MaterialIcons
              name="arrow-drop-down"
              size={28}
              color={colors.gray2}
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
                : data.values.find((element: any) => element.value === selected)
                    ?.label ?? ''
            }
            font={fontFamilies.RobotoMedium}
            color={disable ? colors.text : colors.primary}
          />
          <Space width={4} />
          <FontAwesome5
            name="caret-down"
            size={18}
            color={disable ? colors.text : colors.primary}
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
                {
                  padding: 16,
                  paddingTop: 20,
                },
              ]}>
              <Col>
                <TextComponent
                  text={data.title}
                  size={16}
                  fontFamilies={fontFamilies.RobotoMedium}
                />
              </Col>
              <TouchableOpacity onPress={() => modalizeRef.current?.close()}>
                <AntDesign name="close" color={colors.text} size={22} />
              </TouchableOpacity>
            </Row>
          }
          FooterComponent={
            multible && data.values.length > 0 ? (
              <>
                <Section styles={{paddingTop: 20}}>
                  <Button
                    title="Đồng ý"
                    onPress={() => {
                      // onSelect(itemsSelected);
                      modalizeRef.current?.close();
                    }}
                    type="primary"
                  />
                </Section>
              </>
            ) : (
              <Space height={40} />
            )
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
              <View key={item.value}>
                <Row
                  onPress={() => {
                    if (multible) {
                      handleSelectItem(item.value);
                    } else {
                      if (item.value === 'other') {
                        setIsAddNewValue(true);
                      } else {
                        onSelect(item.value);
                        modalizeRef.current?.close();
                      }
                    }
                  }}
                  styles={[
                    globalStyles.center,
                    {
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderBottomColor: colors.white,
                      borderBottomWidth: index < data.values.length - 1 ? 1 : 0,
                    },
                  ]}>
                  {multible ? (
                    <TextComponent
                      text={item.label}
                      color={
                        itemsSelected && itemsSelected.includes(item.value)
                          ? colors.primary
                          : colors.gray
                      }
                      flex={1}
                      font={
                        itemsSelected && itemsSelected.includes(item.value)
                          ? fontFamilies.RobotoMedium
                          : fontFamilies.RobotoRegular
                      }
                    />
                  ) : (
                    <Col>
                      <TextComponent
                        text={item.label}
                        color={
                          selected === item.value ? colors.primary : colors.text
                        }
                        flex={1}
                        font={
                          selected === item.value
                            ? fontFamilies.RobotoMedium
                            : fontFamilies.RobotoRegular
                        }
                      />
                    </Col>
                  )}
                  {itemsSelected && itemsSelected.includes(item.value) && (
                    <TickCircle size={20} color={colors.primary} />
                  )}
                </Row>
                {item.value === 'other' && isAddNewValue && (
                  <Row styles={{paddingHorizontal: 16}}>
                    <Col>
                      <Input
                        inline
                        radius={8}
                        value={value}
                        onChange={val => setValue(val)}
                        placeholder="Nội dung"
                      />
                    </Col>
                    <Space width={12} />
                    <TouchableOpacity
                      onPress={() => {
                        onSelect(replaceName(value));
                        setValue('');
                        setIsAddNewValue(false);
                        onAddNew &&
                          onAddNew({
                            label: value,
                            value: value,
                          });
                        modalizeRef.current?.close();
                      }}>
                      <TickSquare
                        variant="Bold"
                        size={28}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  </Row>
                )}
              </View>
            ),
            showsVerticalScrollIndicator: false,
          }}
        />
      </Portal>
    </>
  );
};

export default DropdownPicker;
