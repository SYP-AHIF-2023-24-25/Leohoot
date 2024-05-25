namespace Base.Tools;

using System;

public static class DateTimeExtensions
{
    public static DateTime RoundMinute(this DateTime dt, int minutes)
    {
        var minute  = (dt.Minute + dt.Second / 60.0 + dt.Millisecond / 60000.0);
        var rounded = ((int)((minute + minutes / 2.0) / minutes)) * minutes;
        var ret     = new DateTime(dt.Year, dt.Month, dt.Day, dt.Hour, rounded % 60, 0, 0);
        if (rounded >= 60)
        {
            ret = ret.AddHours(1);
        }

        return ret;
    }

    public static bool IsEqualOrAfter(this DateTime time, DateTime? from)
    {
        return (!from.HasValue || from.Value <= time);
    }

    public static bool IsBefore(this DateTime time, DateTime? to)
    {
        return (!to.HasValue || time < to.Value);
    }

    public static string ToNormalizedString(this DateTime date)
    {
        return date.ToString("yyyy.MM.dd");
    }

    public static DateTime FromNormalizedDate(this string dateStr)
    {
        return DateTime.ParseExact(dateStr, "yyyy.MM.dd", null);
    }
}