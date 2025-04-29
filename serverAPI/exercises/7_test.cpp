#include <gtest/gtest.h>

TEST(FuncaoSomaTest, SomaCorreta)
{
    extern int soma(int, int);
    EXPECT_EQ(soma(3, 4), 7);
}