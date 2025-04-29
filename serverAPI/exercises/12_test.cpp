#include <gtest/gtest.h>

TEST(FuncaoMaximoTest, MaximoCorreto)
{
    extern int maximo(int, int, int);
    EXPECT_EQ(maximo(3, 7, 5), 7);
}
