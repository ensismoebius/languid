#include <gtest/gtest.h>
#include "code.cpp"

TEST(TudoMaiusculoTest, Basico) {
    EXPECT_EQ(tudoMaiusculo("gato"), "GATO");
    EXPECT_EQ(tudoMaiusculo("aZul"), "AZUL");
}
