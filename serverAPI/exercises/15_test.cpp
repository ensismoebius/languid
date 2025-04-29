#include <gtest/gtest.h>

TEST(FibonacciRecursivoTest, ValorCorreto)
{
    extern int fibonacci(int n);
    EXPECT_EQ(fibonacci(6), 8);
}
