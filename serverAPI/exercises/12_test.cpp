#include <gtest/gtest.h>
#include "/tmp/code.cpp"  // Inclui o vetor e a função

TEST(FuncaoMaximoTest, MaximoCorreto)
{
    extern int maximo(int, int, int);
    EXPECT_EQ(maximo(3, 7, 5), 7);
}
