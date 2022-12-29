import { APP_CURRENCY } from "@/constants/app";
import { ChartTimeFrameOptions } from "@/constants/stats-contants";
import { useSession } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import { IChartTimeFrame } from "@/types/stat-stypes";
import { TransactionDocument } from "@/types/transaction-types";
import { generateUUIDV4, numberWithCommas } from "@/utils/funcs";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { groupBy, map, mapValues, omit, sum, flatMapDeep, round } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#00C49F", "#e040fb", "#004d40", "#ccff90", "#3e2723"];

interface IChartData<T> {
  key: string;
  data: T[];
}

interface IBarChartData {
  name: string;
  sentCount: number;
  toRedeemCount: number;
  redeemedCount: number;
}

interface IPieChartData {
  name: string;
  count: number;
}

const getGroupedListByDay = (list: any) => {
  const now = moment();
  const convertedTimestamp = map(list, (item: any) => {
    return {
      ...item,
      convertedTimestsamp: moment(item.addedOn.toDate()).format("YYYY-MM-DD"),
      formated: moment(now).isSame(item.addedOn.toDate(), "day"),
    };
  });
  const grouped = mapValues(
    groupBy(convertedTimestamp, "convertedTimestsamp"),
    (clist) => clist.map((chats) => omit(chats, "convertedTimestsamp"))
  );

  const formattedData = Object.keys(grouped).map((key) => {
    return {
      key,
      data: grouped[key],
    };
  });

  return formattedData;
};

const TransactionStats = () => {
  const [selectTimeFrame, setSelectTimeFrame] =
    useState<IChartTimeFrame>("This week");
  const handleChange = (event: SelectChangeEvent) => {
    setSelectTimeFrame(event.target.value as IChartTimeFrame);
  };

  const profile = useSession();

  const [processing, setProcessing] = useState(false);

  const [genericChartData, setGenericChartData] = useState<IBarChartData[]>([]);

  const [pieChartData, setPieChartData] = useState<IPieChartData[]>([]);

  const [pieChartAmountData, setPieChartAmountData] = useState<IPieChartData[]>(
    []
  );

  useEffect(() => {
    (async () => {
      setProcessing(true);
      if (selectTimeFrame === "Today") {
        const now = moment();
        const aDayFromNow = now.clone().subtract(1, "day").toDate();
        const timestamp = Timestamp.fromDate(aDayFromNow);
        const _today = timestamp;

        const { status, errorMessage, list } = await collectionServices.getDocs(
          "Transactions",
          [
            // {
            //   uField: "senderID",
            //   uid: profile.uid,
            // },
            {
              uField: "addedOn",
              uid: _today,
              operator: ">=",
              type: "where",
            },
          ],
          10000,
          false
        );

        if (status === "success") {
          const formattedData = getGroupedListByDay(
            list
          ) as IChartData<TransactionDocument>[];

          const _data = formattedData.map((_d) => {
            return {
              name: moment(_d.key).format("MMM DD"),
              sentCount: _d.data.filter((_dd) => _dd.senderID === profile.uid)
                .length,
              toRedeemCount: _d.data.filter(
                (_dd) =>
                  _dd.recieverPhonenumber === profile.phonenumber &&
                  _dd.isRedeemed === false
              ).length,
              redeemedCount: _d.data.filter(
                (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
              ).length,
            };
          });
          setGenericChartData(_data.reverse());

          setPieChartData([
            {
              name: "Sent",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter((_dd) => _dd.senderID === profile.uid).length
                )
              ),
            },

            {
              name: "To Redeem",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) =>
                        _dd.recieverPhonenumber === profile.phonenumber &&
                        _dd.isRedeemed === false
                    ).length
                )
              ),
            },
            {
              name: "Redeemed",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
                    ).length
                )
              ),
            },
          ]);
          setPieChartAmountData([
            {
              name: "Sent Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter((_dd) => _dd.senderID === profile.uid)
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },

            {
              name: "To Redeem Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed === false
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
            {
              name: "Redeemed Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
          ]);
          setProcessing(false);
        }
        if (status === "error") {
          console.log(errorMessage);
          setProcessing(false);
        }
      }
      if (selectTimeFrame === "This week") {
        const now = moment();
        const aWeekAgoFromNow = now.clone().subtract(1, "week").toDate();
        const timestamp = Timestamp.fromDate(aWeekAgoFromNow);
        const _this_week = timestamp;

        const { status, errorMessage, list } = await collectionServices.getDocs(
          "Transactions",
          [
            // {
            //   uField: "senderID",
            //   uid: profile.uid,
            // },
            {
              uField: "addedOn",
              uid: _this_week,
              operator: ">=",
              type: "where",
            },
          ],
          10000,
          false
        );

        if (status === "success") {
          const formattedData = getGroupedListByDay(
            list
          ) as IChartData<TransactionDocument>[];

          const _data = formattedData.map((_d) => {
            return {
              name: moment(_d.key).format("MMM DD"),
              sentCount: _d.data.filter((_dd) => _dd.senderID === profile.uid)
                .length,
              toRedeemCount: _d.data.filter(
                (_dd) =>
                  _dd.recieverPhonenumber === profile.phonenumber &&
                  _dd.isRedeemed === false
              ).length,
              redeemedCount: _d.data.filter(
                (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
              ).length,
            };
          });
          setGenericChartData(_data.reverse());

          setPieChartData([
            {
              name: "Sent",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter((_dd) => _dd.senderID === profile.uid).length
                )
              ),
            },

            {
              name: "To Redeem",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) =>
                        _dd.recieverPhonenumber === profile.phonenumber &&
                        _dd.isRedeemed === false
                    ).length
                )
              ),
            },
            {
              name: "Redeemed",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
                    ).length
                )
              ),
            },
          ]);
          setPieChartAmountData([
            {
              name: "Sent Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter((_dd) => _dd.senderID === profile.uid)
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },

            {
              name: "To Redeem Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed === false
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
            {
              name: "Redeemed Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
          ]);

          setProcessing(false);
        }
        if (status === "error") {
          console.log(errorMessage);
          setProcessing(false);
        }
      }
      if (selectTimeFrame === "This Month") {
        const now = moment();
        const aMonthAgoFromNow = now.clone().subtract(1, "month").toDate();
        const timestamp = Timestamp.fromDate(aMonthAgoFromNow);
        const _this_month = timestamp;

        const { status, errorMessage, list } = await collectionServices.getDocs(
          "Transactions",
          [
            // {
            //   uField: "senderID",
            //   uid: profile.uid,
            // },
            {
              uField: "addedOn",
              uid: _this_month,
              operator: ">=",
              type: "where",
            },
          ],
          10000,
          false
        );

        if (status === "success") {
          const formattedData = getGroupedListByDay(
            list
          ) as IChartData<TransactionDocument>[];

          const _data = formattedData.map((_d) => {
            return {
              name: moment(_d.key).format("MMM DD"),
              sentCount: _d.data.filter((_dd) => _dd.senderID === profile.uid)
                .length,
              toRedeemCount: _d.data.filter(
                (_dd) =>
                  _dd.recieverPhonenumber === profile.phonenumber &&
                  _dd.isRedeemed === false
              ).length,
              redeemedCount: _d.data.filter(
                (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
              ).length,
            };
          });
          setGenericChartData(_data.reverse());

          setPieChartData([
            {
              name: "Sent",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter((_dd) => _dd.senderID === profile.uid).length
                )
              ),
            },

            {
              name: "To Redeem",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) =>
                        _dd.recieverPhonenumber === profile.phonenumber &&
                        _dd.isRedeemed === false
                    ).length
                )
              ),
            },
            {
              name: "Redeemed",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
                    ).length
                )
              ),
            },
          ]);
          setPieChartAmountData([
            {
              name: "Sent Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter((_dd) => _dd.senderID === profile.uid)
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },

            {
              name: "To Redeem Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed === false
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
            {
              name: "Redeemed Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
          ]);
          setProcessing(false);
        }
        if (status === "error") {
          console.log(errorMessage);
          setProcessing(false);
        }
      }
      if (selectTimeFrame === "This Year") {
        const now = moment();
        const aYearAgoFromNow = now.clone().subtract(1, "year").toDate();
        const timestamp = Timestamp.fromDate(aYearAgoFromNow);
        const _this_year = timestamp;

        const { status, errorMessage, list } = await collectionServices.getDocs(
          "Transactions",
          [
            // {
            //   uField: "senderID",
            //   uid: profile.uid,
            // },
            {
              uField: "addedOn",
              uid: _this_year,
              operator: ">=",
              type: "where",
            },
          ],
          10000,
          false
        );

        if (status === "success") {
          const formattedData = getGroupedListByDay(
            list
          ) as IChartData<TransactionDocument>[];

          const _data = formattedData.map((_d) => {
            return {
              name: moment(_d.key).format("MMM DD"),
              sentCount: _d.data.filter((_dd) => _dd.senderID === profile.uid)
                .length,
              toRedeemCount: _d.data.filter(
                (_dd) =>
                  _dd.recieverPhonenumber === profile.phonenumber &&
                  _dd.isRedeemed === false
              ).length,
              redeemedCount: _d.data.filter(
                (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
              ).length,
            };
          });
          setGenericChartData(_data.reverse());

          setPieChartData([
            {
              name: "Sent",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter((_dd) => _dd.senderID === profile.uid).length
                )
              ),
            },

            {
              name: "To Redeem",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) =>
                        _dd.recieverPhonenumber === profile.phonenumber &&
                        _dd.isRedeemed === false
                    ).length
                )
              ),
            },
            {
              name: "Redeemed",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
                    ).length
                )
              ),
            },
          ]);
          setPieChartAmountData([
            {
              name: "Sent Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter((_dd) => _dd.senderID === profile.uid)
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },

            {
              name: "To Redeem Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed === false
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
            {
              name: "Redeemed Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
          ]);
          setProcessing(false);
        }
        if (status === "error") {
          console.log(errorMessage);
          setProcessing(false);
        }
      }
      if (selectTimeFrame === "Last 30 days") {
        const now = moment();
        const last30DaysFromNow = now.clone().subtract(30, "days").toDate();
        const timestamp = Timestamp.fromDate(last30DaysFromNow);
        const _last_30_days = timestamp;

        const { status, errorMessage, list } = await collectionServices.getDocs(
          "Transactions",
          [
            // {
            //   uField: "senderID",
            //   uid: profile.uid,
            // },
            {
              uField: "addedOn",
              uid: _last_30_days,
              operator: ">=",
              type: "where",
            },
          ],
          10000,
          false
        );

        if (status === "success") {
          const formattedData = getGroupedListByDay(
            list
          ) as IChartData<TransactionDocument>[];

          const _data = formattedData.map((_d) => {
            return {
              name: moment(_d.key).format("MMM DD"),
              sentCount: _d.data.filter((_dd) => _dd.senderID === profile.uid)
                .length,
              toRedeemCount: _d.data.filter(
                (_dd) =>
                  _dd.recieverPhonenumber === profile.phonenumber &&
                  _dd.isRedeemed === false
              ).length,
              redeemedCount: _d.data.filter(
                (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
              ).length,
            };
          });
          setGenericChartData(_data.reverse());

          setPieChartData([
            {
              name: "Sent",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter((_dd) => _dd.senderID === profile.uid).length
                )
              ),
            },

            {
              name: "To Redeem",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) =>
                        _dd.recieverPhonenumber === profile.phonenumber &&
                        _dd.isRedeemed === false
                    ).length
                )
              ),
            },
            {
              name: "Redeemed",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
                    ).length
                )
              ),
            },
          ]);
          setPieChartAmountData([
            {
              name: "Sent Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter((_dd) => _dd.senderID === profile.uid)
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },

            {
              name: "To Redeem Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed === false
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
            {
              name: "Redeemed Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
          ]);
          setProcessing(false);
        }
        if (status === "error") {
          console.log(errorMessage);
          setProcessing(false);
        }
      }
      if (selectTimeFrame === "Last 90 days") {
        const now = moment();
        const last90DaysFromNow = now.clone().subtract(90, "days").toDate();
        const timestamp = Timestamp.fromDate(last90DaysFromNow);
        const _last_90_days = timestamp;

        const { status, errorMessage, list } = await collectionServices.getDocs(
          "Transactions",
          [
            // {
            //   uField: "senderID",
            //   uid: profile.uid,
            // },
            {
              uField: "addedOn",
              uid: _last_90_days,
              operator: ">=",
              type: "where",
            },
          ],
          10000,
          false
        );

        if (status === "success") {
          const formattedData = getGroupedListByDay(
            list
          ) as IChartData<TransactionDocument>[];

          const _data = formattedData.map((_d) => {
            return {
              name: moment(_d.key).format("MMM DD"),
              sentCount: _d.data.filter((_dd) => _dd.senderID === profile.uid)
                .length,
              toRedeemCount: _d.data.filter(
                (_dd) =>
                  _dd.recieverPhonenumber === profile.phonenumber &&
                  _dd.isRedeemed === false
              ).length,
              redeemedCount: _d.data.filter(
                (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
              ).length,
            };
          });
          setGenericChartData(_data.reverse());

          setPieChartData([
            {
              name: "Sent",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter((_dd) => _dd.senderID === profile.uid).length
                )
              ),
            },

            {
              name: "To Redeem",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) =>
                        _dd.recieverPhonenumber === profile.phonenumber &&
                        _dd.isRedeemed === false
                    ).length
                )
              ),
            },
            {
              name: "Redeemed",
              count: sum(
                formattedData.map(
                  (_d) =>
                    _d.data.filter(
                      (_dd) => _dd.recieverPhonenumber === profile.phonenumber && _dd.isRedeemed
                    ).length
                )
              ),
            },
          ]);
          setPieChartAmountData([
            {
              name: "Sent Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter((_dd) => _dd.senderID === profile.uid)
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },

            {
              name: "To Redeem Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed === false
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
            {
              name: "Redeemed Amount",
              count: sum(
                flatMapDeep(
                  formattedData.map((_d) =>
                    _d.data
                      .filter(
                        (_dd) =>
                          _dd.recieverPhonenumber === profile.phonenumber &&
                          _dd.isRedeemed
                      )
                      .map((_ddd) => round(_ddd.amount))
                  )
                )
              ),
            },
          ]);
          setProcessing(false);
        }
        if (status === "error") {
          console.log(errorMessage);
          setProcessing(false);
        }
      }
    })();
  }, [selectTimeFrame, profile.uid,profile.phonenumber]);

  return (
    <>
      <Typography variant="h4" color="textPrimary" textAlign="center">
        Transactions Stats
      </Typography>
      <div>
        <FormControl
          variant="filled"
          fullWidth
          sx={{ m: 1, width: 200, fontWeight: "bold" }}
        >
          <InputLabel id="transaction-filled-label">
            Select a timeframe
          </InputLabel>
          <Select
            labelId="transaction-filled-label"
            id="transaction-filled"
            value={selectTimeFrame}
            onChange={handleChange}
          >
            {ChartTimeFrameOptions.map((option) => (
              <MenuItem key={generateUUIDV4()} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {processing && <p>loading...</p>}
      {!processing && genericChartData.length > 0 && (
        <>
          <div style={{ flex: 1, width: "100%", height: 500 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={genericChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="sentCount"
                  fill="#82ca9d"
                  maxBarSize={100}
                  stackId="a"
                />

                <Bar
                  dataKey="toRedeemCount"
                  fill="#e040fb"
                  maxBarSize={100}
                  stackId="a"
                />

                <Bar
                  dataKey="redeemedCount"
                  fill="#3e2723"
                  maxBarSize={100}
                  stackId="a"
                />
                <Legend height={36} layout="horizontal" />
                <Brush dataKey="name" height={30} stroke="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <div style={{ flex: 1, width: "100%", height: 500 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={400} height={400}>
                    <Legend height={36} layout="vertical" />
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={1}
                      dataKey="count"
                      label
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div style={{ flex: 1, width: "100%", height: 500 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={400} height={400} key={"2"}>
                    <Legend height={36} layout="vertical" />
                    <Pie
                      data={pieChartAmountData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={1}
                      dataKey="count"
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        index,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        // eslint-disable-next-line
                        const radius =
                          25 + innerRadius + (outerRadius - innerRadius);
                        // eslint-disable-next-line
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        // eslint-disable-next-line
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#8884d8"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                          >
                            {APP_CURRENCY}
                            {numberWithCommas(pieChartAmountData[index].count)}
                          </text>
                        );
                      }}
                    >
                      {pieChartAmountData.map((entry, index) => (
                        <Cell
                          key={`cell-2-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Grid>
          </Grid>
        </>
      )}
      {!processing && genericChartData.length === 0 && (
        <Stack alignItems="center">
          <LazyLoadImage
            src={require("@/assets/exclamation-mark.png")}
            style={{ width: 100, height: 100 }}
          />
          <Typography variant="subtitle2" color="textPrimary">
            No records
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default TransactionStats;
