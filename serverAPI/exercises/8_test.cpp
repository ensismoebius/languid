#include <gtest/gtest.h>

TEST(FuncaoFatorialTest, FatorialCorreto)
{
    extern int fatorial(int);
    EXPECT_EQ(fatorial(5), 120);
}