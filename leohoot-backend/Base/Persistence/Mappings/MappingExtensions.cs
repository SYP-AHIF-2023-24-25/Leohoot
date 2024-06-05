namespace Base.Persistence.Mappings;

using System;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public static class MappingExtensions
{
    #region text

    public static PropertyBuilder<string> AsText(this PropertyBuilder<string> builder, int maxLength)
    {
        return builder.IsUnicode().HasMaxLength(maxLength);
    }

    public static PropertyBuilder<string> AsRequiredText(this PropertyBuilder<string> builder, int maxLength)
    {
        return builder.IsUnicode().IsRequired().HasMaxLength(maxLength);
    }

    #endregion

    #region decimal

    public static PropertyBuilder<decimal> AsDecimal(this PropertyBuilder<decimal> builder, int length, int scale)
    {
        return builder.HasColumnType($"decimal({length},{scale})");
    }

    public static PropertyBuilder<decimal?> AsDecimal(this PropertyBuilder<decimal?> builder, int length, int scale)
    {
        return builder.HasColumnType($"decimal({length},{scale})");
    }

    #endregion

    #region date / time

    public static PropertyBuilder<DateTime> AsDate(this PropertyBuilder<DateTime> builder)
    {
        return builder.HasColumnType("date");
    }

    public static PropertyBuilder<DateTime?> AsDate(this PropertyBuilder<DateTime?> builder)
    {
        return builder.HasColumnType("date");
    }

    public static PropertyBuilder<DateTime> AsTime(this PropertyBuilder<DateTime> builder)
    {
        return builder.HasColumnType("time");
    }

    public static PropertyBuilder<DateTime?> AsTime(this PropertyBuilder<DateTime?> builder)
    {
        return builder.HasColumnType("time");
    }

    #endregion
}